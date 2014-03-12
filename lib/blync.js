var hid = require('node-hid');

var Blync = {
  getDevices: function ()
  {
    var devices = hid.devices();

    devices = devices.filter(function (dev) {
      return dev.vendorId === 4400 && dev.productId === 1 && dev.interface === 1;
    });

    devices = devices.map(function (dev) {
      return new Blync.Device(new hid.HID(dev.path));
    });

    return devices;
  },

  getDevice: function (index)
  {
    index = +index || 0;

    var devices = this.getDevices();
    if (index < 0) {
      throw new Error("Invalid device index");
    }
    if (index >= devices.length) {
      throw new Error("Device index #"+index+" not found");
    }

    return devices[index];
  }
};

Blync.Device = require('./device').Device;

module.exports = Blync;
