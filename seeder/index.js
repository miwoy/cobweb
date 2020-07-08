require("../lib/global")
const fs = require("fs");
const path = require("path");
const models = require("models")
const debugFactory = require("debug");

const debug = debugFactory("cobweb:seeder");


const basename = path.basename(module.filename);
let seeder;

if (!seeder) {
	seeder = {};
	fs
		.readdirSync(__dirname)
		.filter(function(file) {
			return (file.indexOf(".") !== 0) && (file !== basename);
		})
		.forEach(function(file) {
			seeder[file.split(".js")[0]] = require(path.join(__dirname, file));
		});
}

let run = async function() {
	if (process.argv[2] === "all") {
		await models.sequelize.sync(conf.mysql.sync.options, {
			match: conf.mysql.sync.match
		}).then(function () {
			debug("sequelize sync success.");
		})
	}

    if (process.argv[2] === "all") {
		return await models.sequelize.transaction(async (t1)=> {
			let keys = Object.keys(seeder)
			await (async function(){
				for(let i=0;i<keys.length;i++) {
					await seeder[keys[i]](t1)
				}
			})()
		})
    }
        
    if (process.argv[2] && seeder[process.argv[2]]) {
		return await seeder[process.argv[2]]()
	}
        
}

run().then(()=>console.log("success")).catch(err=>console.error("error:", err))
