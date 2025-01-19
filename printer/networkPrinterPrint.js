const escpos = require("escpos");
escpos.Network = require("escpos-network");
const usb = require("usb");
escpos.USB = require("escpos-usb");

const networkPrinterPrint = (buffer, Ipaddress) => {
    try {
        console.log("--------------", Ipaddress);
        const networkDevice = new escpos.Network(Ipaddress);
        const networkPrinter = new escpos.Printer(networkDevice);

        // hanlder network device errors
        networkDevice.on('error', (err) => {
            console.log(`Network Error: ${err}`)
            throw new Error(`Network Error: ${err}`);
        });

        // hanlde printer errors
        networkPrinter.on('error', (err) => {
            console.log(`Printer Error: ${err}`)
            throw new Error(`Printer Error: , ${err}`);
        })

        escpos.Image.load(buffer, "image/png", function (image) {
            networkDevice.open(function () {
                networkPrinter.image(image, "D24").then(() => {
                    networkPrinter.cut().close();
                }).catch((err) => {
                    throw new Error(`Error during printing: , ${err}`);
                });
            });
        });
    } catch (error) {
        console.log("error............", error);
    }
};

module.exports = { networkPrinterPrint };