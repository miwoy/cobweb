const nano = require("./db")
const debug = require("debug")("version.bfh.zdbx.net:couchdb:init")
let db
let init = async () => {
    debug("初始化数据库")
    try {
        db = await nano.db.get(conf.couchdb.database)
    } catch (err) {
        if (err.statusCode == 404) {

            await nano.db.create(conf.couchdb.database, {
                partitioned: true
            })
        } else {
            throw err
        }

    }


    db = nano.db.use(conf.couchdb.database)
    let doc
    try {
        doc = await db.get(r._id)
    } catch (err) {

    }

    r._rev = doc && doc._rev
    await db.insert(r)

    debug("初始化updates模型")

}

let r = {
    "_id": "_design/general",
    "language": "javascript",
    "options": {
        "partitioned": true
    },
    "updates": {
        "lib": {
            "dottie": "(function(undefined) {\n  var root = this;\n\n  // Weird IE shit, objects do not have hasOwn, but the prototype does...\n  var hasOwnProp = Object.prototype.hasOwnProperty;\n\n  var reverseDupArray = function (array) {\n    var result = new Array(array.length);\n    var index  = array.length;\n    var arrayMaxIndex = index - 1;\n\n    while (index--) {\n      result[arrayMaxIndex - index] = array[index];\n    }\n\n    return result;\n  };\n\n  var Dottie = function() {\n    var args = Array.prototype.slice.call(arguments);\n\n    if (args.length == 2) {\n      return Dottie.find.apply(this, args);\n    }\n    return Dottie.transform.apply(this, args);\n  };\n\n  // Legacy syntax, changed syntax to have get/set be similar in arg order\n  Dottie.find = function(path, object) {\n    return Dottie.get(object, path);\n  };\n\n  // Dottie memoization flag\n  Dottie.memoizePath = true;\n  var memoized = {};\n\n  // Traverse object according to path, return value if found - Return undefined if destination is unreachable\n  Dottie.get = function(object, path, defaultVal) {\n    if ((object === undefined) || (object === null) || (path === undefined) || (path === null)) {\n        return defaultVal;\n    }\n\n    var names;\n\n    if (typeof path === \"string\") {\n      if (Dottie.memoizePath) {\n        if (memoized[path]) {\n          names = memoized[path].slice(0);\n        } else {\n          names = path.split('.').reverse();\n          memoized[path] = names.slice(0);\n        }\n      } else {\n        names = path.split('.').reverse();\n      }\n    } else if (Array.isArray(path)) {\n      names = reverseDupArray(path);\n    }\n\n    while (names.length && (object = object[names.pop()]) !== undefined && object !== null);\n\n    // Handle cases where accessing a childprop of a null value\n    if (object === null && names.length) object = undefined;\n\n    return (object === undefined ? defaultVal : object);\n  };\n\n  Dottie.exists = function(object, path) {\n    return Dottie.get(object, path) !== undefined;\n  };\n\n  // Set nested value\n  Dottie.set = function(object, path, value, options) {\n    var pieces = Array.isArray(path) ? path : path.split('.'), current = object, piece, length = pieces.length;\n\n    if (typeof current !== 'object') {\n        throw new Error('Parent is not an object.');\n    }\n\n    for (var index = 0; index < length; index++) {\n      piece = pieces[index];\n\n      // Create namespace (object) where none exists.\n      // If `force === true`, bruteforce the path without throwing errors.\n      if (!hasOwnProp.call(current, piece) || current[piece] === undefined || (typeof current[piece] !== 'object' && options && options.force === true)) {\n        current[piece] = {};\n      }\n\n      if (index == (length - 1)) {\n        // Set final value\n        current[piece] = value;\n      } else {\n        // We do not overwrite existing path pieces by default\n        if (typeof current[piece] !== 'object') {\n          throw new Error('Target key \"' + piece + '\" is not suitable for a nested value. (It is in use as non-object. Set `force` to `true` to override.)');\n        }\n\n        // Traverse next in path\n        current = current[piece];\n      }\n    }\n\n    // Is there any case when this is relevant? It's also the last line in the above for-loop\n    current[piece] = value;\n  };\n\n  // Set default nested value\n  Dottie['default'] = function(object, path, value) {\n    if (Dottie.get(object, path) === undefined) {\n      Dottie.set(object, path, value);\n    }\n  };\n\n  // Transform unnested object with .-seperated keys into a nested object.\n  Dottie.transform = function Dottie$transformfunction(object, options) {\n    if (Array.isArray(object)) {\n      return object.map(function(o) {\n        return Dottie.transform(o, options);\n      });\n    }\n\n    options = options || {};\n    options.delimiter = options.delimiter || '.';\n\n    var pieces\n      , piecesLength\n      , piece\n      , current\n      , transformed = {}\n      , key\n      , keys = Object.keys(object)\n      , length = keys.length\n      , i;\n\n    for (i = 0; i < length; i++) {\n      key = keys[i];\n\n      if (key.indexOf(options.delimiter) !== -1) {\n        pieces = key.split(options.delimiter);\n        piecesLength = pieces.length;\n        current = transformed;\n\n        for (var index = 0; index < piecesLength; index++) {\n          piece = pieces[index];\n          if (index != (piecesLength - 1) && !current.hasOwnProperty(piece)) {\n            current[piece] = {};\n          }\n\n          if (index == (piecesLength - 1)) {\n            current[piece] = object[key];\n          }\n\n          current = current[piece];\n          if (current === null) {\n            break;\n          }\n        }\n      } else {\n        transformed[key] = object[key];\n      }\n    }\n\n    return transformed;\n  };\n\n  Dottie.flatten = function(object, seperator) {\n    if (typeof seperator === \"undefined\") seperator = '.';\n    var flattened = {}\n      , current\n      , nested;\n\n    for (var key in object) {\n      if (hasOwnProp.call(object, key)) {\n        current = object[key];\n        if (Object.prototype.toString.call(current) === \"[object Object]\") {\n          nested = Dottie.flatten(current, seperator);\n\n          for (var _key in nested) {\n            flattened[key+seperator+_key] = nested[_key];\n          }\n        } else {\n          flattened[key] = current;\n        }\n      }\n    }\n\n    return flattened;\n  };\n\n  Dottie.paths = function(object, prefixes) {\n    var paths = [];\n    var value;\n    var key;\n\n    prefixes = prefixes || [];\n\n    if (typeof object === 'object') {\n      for (key in object) {\n        value = object[key];\n\n        if (typeof value === 'object' && value !== null) {\n          paths = paths.concat(Dottie.paths(value, prefixes.concat([key])));\n        } else {\n          paths.push(prefixes.concat(key).join('.'));\n        }\n      }\n    } else {\n      throw new Error('Paths was called with non-object argument.');\n    }\n\n    return paths;\n  };\n\n  if (typeof module !== 'undefined' && module.exports) {\n    exports = module.exports = Dottie;\n  } else {\n    root['Dottie'] = Dottie;\n    root['Dot'] = Dottie; //BC\n\n    if (typeof define === \"function\") {\n      define([], function () { return Dottie; });\n    }\n  }\n})();"
        },
        "incrementUpdate": (function (doc, req) {
            doc = doc || {}
            if (!req.body) {
                return [null, {
                    json: {
                        errmsg: "未找到文档",
                        errno: 404
                    }
                }]
            }

            let new_doc = JSON.parse(req.body)
            let dottie = require("updates/lib/dottie")
            Object.keys(new_doc).map(key => {
                dottie.set(doc, key, new_doc[key])
            })
            return [doc, {
                json: {
                    errno: 0,
                    errmsg: "ok",
                    _id: doc._id,
                    _rev: doc._rev,
                    ok: true
                }
            }]
        }).toString()
    }
}

let run = async () => {
    await init()
    // await test()
}


run().then(console.log).catch(console.error)
