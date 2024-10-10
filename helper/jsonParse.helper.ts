export const jsonParseHelper = (record) => {
    record.forEach(item => {
        if(item['imgs']) {
            item['imgs'] = JSON.parse(item['imgs'])
        }
    })
}