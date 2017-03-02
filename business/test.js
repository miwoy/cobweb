import test from "./impl/test";


export default (repository) => {
    return {
        getTests: async() => {
            let tests = await test.getTests(repository);
            return tests;
        },
        setTest: async() => {
            let r = await test.setTest(repository);
            return r;
        },
        begin: async() => {
            let trans = await repository.begin();
            let r = await test.begin(trans);

            await trans.commit();

            return r;
        }
    }
}
