const request = require('hyperquest');
const concat = require('concat-stream');

module.exports = function(serno, cb) {
    const url = `http://www.epson.co.uk/gb/en/viewcon/corporatesite/modules/warranty_details/search?ajax=true&serial=${serno}`;
    request(url).pipe(concat((json) => {
        var data;
        try {
            data = JSON.parse(json);
        } catch(e) {
            return cb(e);
        }
        var err = null;
        if (data.status === 'failed') {
            err = new Error(data.error);
            data = null;
        } else {
            data = [data.data.model, data.data.material_number, data.data.product_id];
        }
        cb(err, data);
    }));
};
