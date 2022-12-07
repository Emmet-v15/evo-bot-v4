module.exports = {
    apps : [{
        name   : "botv1",
        script : "./index.js",
        error_file : "./logs/error.log",
        out_file : "./logs/out.log",
        log_date_format: "DD MM YYYY HH:mm:ss",
        shutdown_with_message: true
    }]
}