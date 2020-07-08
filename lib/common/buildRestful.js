const qs = require("qs")
const util = require("./util")
const models = require("../../models")
const { authenticate } = require("lib/middleware")
const inflection = require('inflection'); // 复数转化
const debugFactory = require("debug");
const debug = debugFactory("cobweb:lib:common:buildRestful");



const DEPTH = 1
const MAX_DEPTH = 5
const MIN_DEPTH = 1

/**
 * 逐级限定
 */
function associationLimit(ctx, parents) {
    let model = null
    return parents.reduce((total, p, index) => { // 逐级限定
        let association = {
            where: {
                id: ctx.params[p[0] + "Id"]
            },
            model: p[1]
        }

        if (index != parents.length - 1) {
            association.attributes = []
        }

        if (total) { // 附加别名
            let ass
            if (["HasOne", "BelongsTo", "HasMany"].indexOf(model.associations[p[0]].associationType) >= 0) {
                ass = _.values(p[1].associations).find(ass => model.name == ass.target.name && ass.foreignKey == model.associations[p[0]].foreignKey)
            } else if (model.associations[p[0]].associationType == "BelongsMany") {
                ass = _.values(p[1].associations).find(ass => model.name == ass.target.name && model.associations[p[0]].through == ass.through)
            }
            if (ass) total.as = ass.as
            association.include = total
        }
        model = p[1]
        return association
    }, undefined)
}

/**
 * 清理url后面的‘/’
 */
function cleanUrl(url) {
    return url[url.length - 1] == "/" ? url.slice(0, -1) : url
}

/**
 * 控制循环引用
 */
function breakCircle(parents, association) {
    return parents.length > 0 &&
        (parents.slice(0, -1).find(p => p[1].name === association.target.name)) ||
        (parents.slice(-1)[0][1].name === "permission" && parents.slice(-1)[0][0] !== association.as)
}

/**
 * 根据 depth 生成 include 子查询
 */
function buildIncludes(association, model, d, parents) {
    if (--d >= DEPTH) {
        let associations = association.model.associations;
        if (!associations || _.keys(associations).length == 0) return
        association.include = _.keys(associations).reduce((r, k) => {
            let association = associations[k]
            // 解除循环引用
            if (breakCircle(parents, association))
                return r
            let _association = {
                model: associations[k].target,
                as: associations[k].as
            }
            buildIncludes(_association, association.model, d, parents.concat([
                [k, association.target]
            ]))
            r.push(_association)
            return r
        }, [])
    }
}

/**
 * 根据 depth 对最深层的依赖附加资源定位 url
 */
function includesUrl(instance, d, path, parents) {
    if (!instance) return
    path = path.concat([instance.id])
    instance.dataValues["source_url"] = `${path.join("/")}`
    let associations = instance.constructor.associations;
    if (!associations || _.keys(associations).length == 0) return
    if (--d < DEPTH) {
        _.keys(associations).map(key => {
            let association = associations[key]
            if (breakCircle(parents, association))
                return
            instance.dataValues[key] = `${path.join("/")}/${key}`
        })
    } else {
        _.keys(associations).map(key => {
            if (instance[key]) {
                if (_.isArray(instance[key])) {
                    instance[key].map(i => {
                        includesUrl(i, d, path.concat([key]), parents.concat([
                            [key, associations[key].target]
                        ]))
                    })
                } else {
                    includesUrl(instance[key], d, path.concat([key]), parents.concat([
                        [key, associations[key].target]
                    ]))
                }
            }

        })
    }
}

/**
 * 对分页数据结果处理，包含对结果 includesUrl 处理
 */
function handleArrayResult(model, options) {
    let {
        body,
        depth,
        baseApiPath,
        query,
        url,
        parents
    } = options

    // 为子查询附加 url
    body.rows.map(r => {
        includesUrl(r, depth, baseApiPath, parents)
    })

    body = {
        current_page: query.pageIndex, // 可以使用默认配置 conf.restful.default.pageSize
        per_page: query.pageSize,
        last_page: Math.ceil(body.count / query.pageSize),
        total: body.count,
        data: body.rows
    }

    query.pageIndex = body.current_page < body.last_page ? body.current_page + 1 : (body.last_page || 1)
    body.next_page_url = url + "?" + qs.stringify(query)
    query.pageIndex = body.current_page > 1 ? body.current_page - 1 : 1
    body.pre_page_url = url + "?" + qs.stringify(query)
    return body
}

/**
 * TODO
 * 异常处理， 对于 depth 最大值限制
 * 命名，抽象
 * 注释，文档
 */
module.exports = (router, model) => {
    const associations = model.associations
    const schema = model.getSchema()
    /**
     * 获取列表
     */
    router.get(`${model.name}.list`, "/", authenticate, async (ctx) => {
        if (ctx.q.depth < MIN_DEPTH || ctx.q.depth > MAX_DEPTH) throw new InvalidArgsGeneralityError(`depth 参数值必须在 ${MIN_DEPTH}-${MAX_DEPTH} 范围内`)
        let depth = ctx.q.depth || DEPTH
        let url = `${ctx.request.origin}${ctx.path}`
        let baseApiPath = cleanUrl(url).split("/")
        // 按照 depth 生成 includes 层级

        // 设置默认值
        ctx.q = ctx.q || {}
        ctx.q.pageSize = ctx.q.pageSize * 1 || 10;
        ctx.q.pageIndex = ctx.q.pageIndex * 1 || 1;

        // 格式化 query 参数
        let query = {}
        query.where = ctx.q.query;
        query.limit = ctx.q.pageSize
        query.offset = ctx.q.pageSize * (ctx.q.pageIndex - 1)
        query.model = model

        // 生成子查询
        buildIncludes(query, null, depth, [
            [inflection.pluralize(model.name), model]
        ])

        let body = await (ctx.q.hasOwnProperty("all") ? model.scope() : model).findAndCountAll(query)

        ctx.sbody = handleArrayResult(model, {
            query: ctx.q,
            url,
            baseApiPath,
            depth,
            body,
            parents: [
                [baseApiPath.slice(-1)[0], model]
            ]
        })
    })

    /**
     * 获取模型
     */
    router.get(`${model.name}.schema`, "/schema", async (ctx) => {
        ctx.sbody = await model.getSchema()
    })

    /**
     * 获取实例
     */
    router.get(`${model.name}.object`, "/:id", authenticate, async (ctx) => {
        if (ctx.q.depth < MIN_DEPTH || ctx.q.depth > MAX_DEPTH) throw new InvalidArgsGeneralityError(`depth 参数值必须在 ${MIN_DEPTH}-${MAX_DEPTH} 范围内`)
        let url = `${ctx.request.origin}${ctx.path}`
        let baseApiPath = cleanUrl(url).split("/").slice(0, -1)
        let depth = ctx.q.depth || DEPTH
        let options = {
            model: model
        }
        buildIncludes(options, null, depth, [
            [inflection.pluralize(model.name), model]
        ])
        let r = await (ctx.q.hasOwnProperty("all") ? model.scope() : model).findByPk(ctx.params.id, options)
        includesUrl(r, depth, baseApiPath, [
            [baseApiPath.slice(-1)[0], model]
        ])
        ctx.sbody = r
    })

    /**
     * 增加实例
     */
    router.post(`${model.name}.create`, "/", authenticate, async (ctx) => {
        try {
            await model.create(ctx.rbody)
            ctx.status = 201
        } catch (e) {
            if (e.name == "SequelizeValidationError") throw new InvalidDataGeneralityError(e.message)
            else if (e.name == "SequelizeUniqueConstraintError") throw new InvalidDataGeneralityError(e.parent)
            else throw e
        }

    })

    /**
     * 整体更新
     */
    router.put(`${model.name}.put`, "/:id", authenticate, async (ctx) => {
        try {
            await models.sequelize.transaction(async (t1) => {
                let r = await (ctx.q.hasOwnProperty("all") ? model.scope() : model).destroy({
                    where: {
                        id: ctx.params.id
                    },
                    force: true,
                    transaction: t1
                })
                if (!r) throw new RequiredDataGeneralityError("数据不存在")
                ctx.rbody.id = ctx.params.id
                await model.create(ctx.rbody, {
                    transaction: t1
                })
            })

            ctx.status = 204
        } catch (e) {
            if (e.name == "SequelizeValidationError") throw new InvalidDataGeneralityError(e.message)
            else if (e.name == "SequelizeUniqueConstraintError") throw new InvalidDataGeneralityError(e.parent)
            else throw e
        }

    })

    /**
     * 局部更新，按id
     */
    router.patch(`${model.name}.patch`, "/:id", authenticate, async (ctx) => {
        try {
            delete ctx.rbody.id
            ctx.sbody = (await (ctx.q.hasOwnProperty("all") ? model.scope() : model).update(ctx.rbody, {
                where: {
                    id: ctx.params.id
                }
            }))[0]
            ctx.status = 200
        } catch (e) {
            if (e.name == "SequelizeValidationError") throw new InvalidDataGeneralityError(e.message)
            else if (e.name == "SequelizeUniqueConstraintError") throw new InvalidDataGeneralityError(e.parent)
            else throw e
        }
    })

    /**
     * 局部更新, 按条件
     */
    router.patch(`${model.name}.patch`, "/", authenticate, async (ctx) => {
        if (_.keys(ctx.q.query).length == 0) throw new RequiredArgsGeneralityError("必须存在更新条件")
        _.keys(ctx.q.query).map(k => {
            if (!schema[k]) throw new InvalidArgsGeneralityError(`无效的更新条件 ${k}=${ctx.q.query[k] }, 更新条件的属性必须是模型 schema 中明确定义的`)
        })

        try {
            delete ctx.rbody.id // 不能更新id
            ctx.sbody = (await (ctx.q.hasOwnProperty("all") ? model.scope() : model).update(ctx.rbody, {
                where: ctx.q.query
            }))[0]
            ctx.status = 200
        } catch (e) {
            if (e.name == "SequelizeValidationError") throw new InvalidDataGeneralityError(e.message)
            else if (e.name == "SequelizeUniqueConstraintError") throw new InvalidDataGeneralityError(e.parent)
            else throw e
        }
    })

    /**
     * 按 Id 删除
     */
    router.delete(`${model.name}.deleteById`, "/:id", authenticate, async (ctx) => {
        if (!ctx.params.id) throw new RequiredArgsGeneralityError("必须存在 param 参数 id")
        ctx.sbody = await (ctx.q.hasOwnProperty("all") ? model.scope() : model).destroy({
            where: {
                id: ctx.params.id
            }
        })
        ctx.status = 200
    })

    /**
     * 按条件删除
     */
    router.delete(`${model.name}.delete`, "/", authenticate, async (ctx) => {
        if (_.keys(ctx.q.query).length == 0) throw new RequiredArgsGeneralityError("必须存在删除条件")
        _.keys(ctx.q.query).map(k => {
            if (!schema[k]) throw new InvalidArgsGeneralityError(`无效的删除条件 ${k}=${ctx.q.query[k] }, 删除条件的属性必须是模型 schema 中明确定义的`)
        })
        ctx.sbody = await (ctx.q.hasOwnProperty("all") ? model.scope() : model).destroy({
            where: ctx.q.query
        })

        ctx.status = 200
    })

    /**
     * 子路由，未限制层级
     */
    let deep = function (model, parents, rootModel) {
        let associations = model.associations
        if (!associations || _.keys(associations).length == 0) return
        _.keys(associations).map(k => {
            let association = associations[k]

            // 设置 permission 为终点路径
            if (breakCircle(parents, association))
                return

            let routeNamePrefix = parents.map(p => p[0]).concat([k]).join(".")
            let routePathPrefix = `/:${rootModel}Id/${parents.slice(1).map(p=>`${p[0]}/:${p[0]}Id/`).join("")+k}`
            debug(routeNamePrefix)
            let nextParents = parents.concat([
                [k, association.target]
            ])
            /**
             * 获取列表
             */
            router.get(`${routeNamePrefix}.list`, `${routePathPrefix}/`, authenticate, async (ctx) => {
                if (ctx.q.depth < MIN_DEPTH || ctx.q.depth > MAX_DEPTH) throw new InvalidArgsGeneralityError(`depth 参数值必须在 ${MIN_DEPTH}-${MAX_DEPTH} 范围内`)
                let depth = ctx.q.depth || DEPTH
                let url = `${ctx.request.origin}${ctx.path}`
                let baseApiPath = cleanUrl(url).split("/")

                let where = associationLimit(ctx, parents)
                console.log("debug", where, JSON.stringify(where), parents)
                let instance = await model.findOne(where)
                if (!instance) throw new RequiredDataGeneralityError(`不存在实例数据`)
                let options = {
                    limit: ctx.q.pageSize * 1 || 10,
                    offset: ((ctx.q.pageIndex || 1) - 1) * (ctx.q.pageSize * 1 || 10),
                    model: association.target
                }
                buildIncludes(options, null, depth, nextParents)
                let r = await instance[`get${util.convertC2P(k)}`](options)
                if (instance[`count${util.convertC2P(k)}`]) {
                    let count = await instance[`count${util.convertC2P(k)}`]()

                    ctx.q = ctx.q || {};
                    ctx.q.pageSize = ctx.q.pageSize * 1 || 10;
                    ctx.q.pageIndex = ctx.q.pageIndex * 1 || 1;
                    let body = {
                        rows: r,
                        count: count
                    }

                    ctx.sbody = handleArrayResult(association.target, {
                        query: ctx.q,
                        baseApiPath,
                        url,
                        depth,
                        body,
                        parents: nextParents
                    })
                } else {
                    if (r) {
                        includesUrl(r, depth, baseApiPath, nextParents)
                    }
                    ctx.sbody = r
                }

            })

            /**
             * 获取实例
             */
            router.get(`${routeNamePrefix}.object`, `${routePathPrefix}/:childId`, authenticate, async (ctx) => {
                if (ctx.q.depth < MIN_DEPTH || ctx.q.depth > MAX_DEPTH) throw new InvalidArgsGeneralityError(`depth 参数值必须在 ${MIN_DEPTH}-${MAX_DEPTH} 范围内`)
                let depth = ctx.q.depth || DEPTH
                let url = `${ctx.request.origin}${ctx.path}`
                let baseApiPath = cleanUrl(url).split("/").slice(0, -1)
                let where = associationLimit(ctx, parents)
                let instance = await model.findOne(where)
                if (!instance) throw new RequiredDataGeneralityError(`不存在实例数据`)

                let options = {
                    model: association.target,
                    where: {
                        id: ctx.params.childId
                    }
                }
                buildIncludes(options, null, depth, nextParents)
                let r = await instance[`get${util.convertC2P(k)}`](options)
                r = r ? (r[0] || r) : null
                if (r) {
                    includesUrl(r, depth, baseApiPath, nextParents)
                }
                ctx.sbody = r

            })

            /**
             * 新增关系
             */
            router.post(`${routeNamePrefix}.create`, `${routePathPrefix}/`, authenticate, async (ctx) => {
                await models.sequelize.transaction(async (t1) => {
                    let where = associationLimit(ctx, parents)

                    let instance = await model.findOne(where)
                    if (!instance) throw new RequiredDataGeneralityError(`不存在实例数据`)

                    let childInstances = await association.target.findOrCreate({
                        where: ctx.rbody
                    })
                    let r = await instance[`${inflection.singularize(k)!=k?"add":"set"}${util.convertC2P(inflection.singularize(k))}`](childInstances[0])
                    ctx.status = 201
                })
            })

            /**
             * 整体更新
             */
            router.put(`${routeNamePrefix}.put`, `${routePathPrefix}/:childId`, authenticate, async (ctx) => {
                let where = associationLimit(ctx, parents)
                try {

                    await models.sequelize.transaction(async (t1) => {
                        let instance = await model.findOne(where, {
                            transaction: t1
                        })
                        if (!instance) throw new RequiredDataGeneralityError(`不存在实例数据`)
                        let r = await instance[`get${util.convertC2P(k)}`]({
                            where: {
                                id: ctx.params.childId
                            },
                            transaction: t1
                        })

                        if (!(r ? (r[0] || r) : null)) throw new RequiredDataGeneralityError(`不存在实例数据`)
                        await association.target.destroy({
                            where: {
                                id: ctx.params.childId
                            },
                            force: true,
                            transaction: t1
                        })

                        ctx.rbody.id = ctx.params.childId
                        r = await association.target.create(ctx.rbody, {
                            transaction: t1
                        })

                        await instance[`${inflection.singularize(k)!=k?"add":"set"}${util.convertC2P(inflection.singularize(k))}`](r, {
                            transaction: t1
                        })

                    })
                    ctx.status = 204
                } catch (e) {
                    if (e.name == "SequelizeValidationError") throw new InvalidDataGeneralityError(e.message)
                    else if (e.name == "SequelizeUniqueConstraintError") throw new InvalidDataGeneralityError(e.parent)
                    else throw e
                }
            })

            /**
             * 局部更新
             */
            router.patch(`${routeNamePrefix}.patch`, `${routePathPrefix}/`, authenticate, async (ctx) => {
                if (_.keys(ctx.q.query).length == 0) throw new RequiredArgsGeneralityError("必须存在更新条件")
                _.keys(ctx.q.query).map(k => {
                    if (!schema[k]) throw new InvalidArgsGeneralityError(`无效的更新条件 ${k}=${ctx.q.query[k] }, 更新条件的属性必须是模型 schema 中明确定义的`)
                })
                let where = associationLimit(ctx, parents)

                let instance = await model.findOne(where)
                if (!instance) throw new RequiredDataGeneralityError(`不存在实例数据`)
                let r = await instance[`get${util.convertC2P(k)}`]({
                    where: ctx.q.query
                })

                if (!(r ? (r[0] || r) : null)) throw new RequiredDataGeneralityError(`不存在实例数据`)
                try {
                    delete ctx.rbody.id
                    ctx.sbody = (await association.target.update(ctx.rbody, {
                        where: {
                            id: !r.reduce ? r.id : r.map(i => i.id)
                        }
                    }))[0]
                    ctx.status = 200
                } catch (e) {
                    if (e.name == "SequelizeValidationError") throw new InvalidDataGeneralityError(e.message)
                    else if (e.name == "SequelizeUniqueConstraintError") throw new InvalidDataGeneralityError(e.parent)
                    else throw e
                }
            })

            /**
             * 局部更新 by Id
             */
            router.patch(`${routeNamePrefix}.patch`, `${routePathPrefix}/:childId`, authenticate, async (ctx) => {
                let where = associationLimit(ctx, parents)

                let instance = await model.findOne(where)
                if (!instance) throw new RequiredDataGeneralityError(`不存在实例数据`)
                let r = await instance[`get${util.convertC2P(k)}`]({
                    where: {
                        id: ctx.params.childId
                    }
                })

                if (!(r ? (r[0] || r) : null)) throw new RequiredDataGeneralityError(`不存在实例数据`)
                try {
                    delete ctx.rbody.id
                    ctx.sbody = (await association.target.update(ctx.rbody, {
                        where: {
                            id: !r.reduce ? r.id : r.map(i => i.id)
                        }
                    }))[0]
                    ctx.status = 200
                } catch (e) {
                    if (e.name == "SequelizeValidationError") throw new InvalidDataGeneralityError(e.message)
                    else if (e.name == "SequelizeUniqueConstraintError") throw new InvalidDataGeneralityError(e.parent)
                    else throw e
                }
            })

            /**
             * 删除
             */
            router.delete(`${routeNamePrefix}.delete`, `${routePathPrefix}/:childId`, authenticate, async (ctx) => {
                await models.sequelize.transaction(async (t1) => {
                    let where = associationLimit(ctx, parents)

                    let instance = await model.findOne(where)
                    if (!instance) throw new RequiredDataGeneralityError(`不存在实例数据`)
                    let r = await instance[`get${util.convertC2P(k)}`]({
                        where: {
                            id: ctx.params.childId
                        }
                    })

                    if (!(r ? (r[0] || r) : null)) throw new RequiredDataGeneralityError(`不存在实例数据`)

                    if (ctx.q.hasOwnProperty("rupture")) { // 如果传递了 rupture 标记，则代表仅仅解除关系，而不删除数据
                        if (!r[0]) {
                            r = await instance[`set${util.convertC2P(inflection.singularize(k))}`](null)
                        } else {
                            let childInstance = await association.target.findByPk(ctx.params.childId)
                            r = await instance[`remove${util.convertC2P(inflection.singularize(k))}`](r)
                        }
                    } else {
                        await association.target.destroy({
                            where: {
                                id: !r.reduce ? r.id : r.map(i => i.id)
                            }
                        })
                    }

                    ctx.status = 204
                })
            })



            deep(association.target, nextParents, rootModel)
        })
    }

    deep(model, [
        [inflection.pluralize(model.name), model]
    ], inflection.pluralize(model.name))
}