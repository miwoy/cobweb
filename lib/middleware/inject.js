import _ from "lodash";
import business from "../../business";

export default async function(ctx, next) {
    ctx.business = business;
    await next();
}
