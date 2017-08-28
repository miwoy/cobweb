import request from 'request';

function get(url) {
    return new Promise(function(resolve, reject) {
        request.get(url,function (err,httpResponse,body) {
            if (err) {
                reject(err);
            } else {
                if(httpResponse.statusCode === 200){
                    body =JSON.parse(body);
                    resolve(body);
                }else {
                    reject(httpResponse.statusCode);
                }
            }
        })
    })
}

function post(url,data) {
   return new Promise(function (resolve,reject) {
       request.post(url,{form:data},function (err,httpResponse,body) {
           if(err){
               reject(err);
           }else {
               if(httpResponse.statusCode === 200){
                   resolve(body);
               }else {
                   reject(httpResponse.statusCode);
               }
           }
       })
   })
}

export default {
    get:get,
    post:post
}
