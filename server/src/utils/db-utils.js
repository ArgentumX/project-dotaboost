class DbUtils {
    /* OPTIONS VALUES MUST BE VALIDATED. Example: { 'key1':'1' , 'key':'2' }
     Generates special value for sequelize search settings field 'where' */
    createFilter(options, allowedKeys) {
        const filter = {};
        for (const key of allowedKeys) {
            if (options[key]) {
                filter[key] = options[key];
            }
        }
        return filter;
    }
}

module.exports = new DbUtils();
