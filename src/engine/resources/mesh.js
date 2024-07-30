(function () {
  coffeeEngine.resources.mesh = class extends coffeeEngine.resources.resource {
    deserialize(serialized) {
      let { data, pointCount } = JSON.parse(serialized);

      if (!data || !pointCount) return;

      const dataKeys = Object.keys(data);

      dataKeys.forEach((dataKey) => {
        data[dataKey] = new Float32Array(data[dataKey]);
      });

      this.data = data;
      this.pointCount = pointCount;
    }

    serialize() {
      let serializedData = this.data;

      const dataKeys = Object.keys(serializedData);

      dataKeys.forEach((dataKey) => {
        serializedData[dataKey] = Array.from(serializedData[dataKey]);
      });

      return {
        data: JSON.stringify({
          data: serializedData,
          pointCount: this.pointCount,
        }),
        format: coffeeEngine.DataTypes.TEXT,
        extension: "mesh",
      };
    }
  };
})();
