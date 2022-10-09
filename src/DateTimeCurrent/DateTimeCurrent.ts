function DateTime() {
    const currentdate = new Date();
    const datetime =
        currentdate.getDate() +
        '/' +
        (currentdate.getMonth() + 1) +
        '/' +
        currentdate.getFullYear() +
        '  ' +
        currentdate.getHours() +
        ':' +
        (currentdate.getMinutes() + 1) +
        ':' +
        currentdate.getSeconds();
    return datetime;
}
export default DateTime;
