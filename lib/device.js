var Device = function (hidDevice) {
  this.hidDevice = hidDevice;
  this.currentColor = 'off';
};

Device.colors = {
  off: 255,
  white: 15,
  magenta: 47,
  blue: 63,
  cyan: 31,
  green: 95,
  red: 111,
  yellow: 79
};

Device.prototype.setColor = function (color, noPersistence) {
  if ("undefined" === typeof Device.colors[color]) {
    throw new Error("Unknown color: "+color);
  }

  if (!noPersistence) this.currentColor = color;

  this.sendCommand(Device.colors[color]);
};

Device.prototype.sendCommand = function (controlCode) {
  var commandBuffer = [];

  commandBuffer[0] = 0;
  commandBuffer[1] = 85;
  commandBuffer[2] = 83;
  commandBuffer[3] = 66;
  commandBuffer[4] = 67;
  commandBuffer[5] = 0;
  commandBuffer[6] = 64;
  commandBuffer[7] = 2;
  commandBuffer[8] = controlCode & 0xFF;

  this.hidDevice.write(commandBuffer);
};

Device.prototype.flashColor = function (color, duration) {
  var _this = this;

  if (this.offTimer) clearTimeout(this.offTimer);

  duration = duration || 200;
  this.setColor(color, true);
  this.offTimer = setTimeout(function () {
    _this.setColor(_this.currentColor, true);
  }, duration);
};

Device.prototype.turnOff = function () {
  this.setColor('off');
};

Device.prototype.startFlicker = function (color1, color2, duration1, duration2)
{
  var _this = this;

  duration1 = duration1 || 50;
  duration2 = duration2 || duration1;

  if (this.flickerInterval) clearTimeout(this.flickerInterval);

  this.flickerInterval = setInterval(function () {
    _this.setColor(color1);
    setTimeout(function () {
      _this.setColor(color2);
    }, 50);
  }, duration1+duration2);
};

Device.prototype.stopFlicker = function ()
{
  if (this.flickerInterval) clearTimeout(this.flickerInterval);
};

exports.Device = Device;
