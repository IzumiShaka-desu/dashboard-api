const { getMpsPattern } = require('./pool');
const mpsPatternHandler = async (request, h) => {
    let results = (await getMpsPattern()).map((item) => {
        return {
            tanggal_mps: item.tanggal_mps,
            line: item.line_mps,
            qty: item.qty_mps,
            type: item.type,
        }
    },);
    let lines = [...new Set(results.map((item) => item.line))];
    let date = new Date()
    let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // create array of Date(object) from first day of this month to last day of this month
    let dateOfThisMonth = Array.from(new Array(lastDay.getDate()), (val, index) => new Date(date.getFullYear(), date.getMonth(), index + 1));

    let result = lines.map((line) => {
        let data = results.filter((item) => item.line == line);
        //this using type on this line because to make sure every type ini this line is included
        // you can also change this scope to type on this date 
        let typeOnThisLine = [...new Set(data.map((item) => item.type))];
        // let tanggal_mps = [...new Set(data.map((item) => item.tanggal_mps))];
        let dataByDateGroupByType = dateOfThisMonth.map((date) => {
            let dataByDate = data.filter((item) => item.tanggal_mps == date);
            // let typeOnThisDate = [...new Set(dataByDate.map((item) => item.type))];
            let dataByDateGroupByType = typeOnThisLine.map((type) => {
                let dataByType = dataByDate.filter((item) => item.type == type);
                let qty = dataByType.reduce((acc, curr) => {
                    return acc + curr.qty;
                }, 0);
                return {
                    type: type,
                    qty: qty < 1 ? "-" : `${qty}`,
                }

            }
            );
            //

            return {
                tanggal_mps: date,
                data: dataByDateGroupByType,
            }
        });

        let summaryByType = typeOnThisLine.map((type) => {
            let dataByType = data.filter((item) => item.type == type);
            let qty = dataByType.reduce((acc, curr) => {
                return acc + curr.qty;
            }, 0);
            return {
                type: type,
                qty: qty < 1 ? "-" : `${qty}`,
            }
        });

        return {
            line: line,
            data: dataByDateGroupByType,
            title: "MPS Pattern ",//mps pa
            summary: summaryByType,
        }
    });


    return h.response({
        status: 'success',
        data: {
            //MPS Pattern <current month string><current year>
            title: `MPS Pattern ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`,
            items: result,
        },
    },).code(200);
}

const wpsPatternHandler = (request, h) => {

    return h.response({
        status: 'error',
        message: 'WPS Pattern is not implemented yet',
    }).code(500);

}
const woPatternHandler = (request, h) => {
    return h.response({
        status: 'error',
        message: 'WO Pattern is not implemented yet',
    }).code(500);
}
module.exports = {
    mpsPatternHandler,
    wpsPatternHandler,
    woPatternHandler,
}