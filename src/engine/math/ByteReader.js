//Taken from SECTORZ's wad reader
(function() {
    coffeeEngine.byteReader = {
        int8_LIM:Math.pow(2,8),
        int16_LIM:Math.pow(2,16),
        int32_LIM:Math.pow(2,32),

        int8_HLF:Math.pow(2,8) / 2,
        int16_HLF:Math.pow(2,16) / 2,
        int32_HLF:Math.pow(2,32) / 2,

        ReadByte:(byteArray,offset,isSigned) => {
            let num = coffeeEngine.byteReader.ReadBytes(byteArray,offset,1);
            if (isSigned) {
                if (num > coffeeEngine.byteReader.int8_HLF) num -= coffeeEngine.byteReader.int8_LIM;
            }
            return num;
        },
        Read2Bytes:(byteArray,offset,isSigned) => {
            let num = coffeeEngine.byteReader.ReadBytes(byteArray,offset,2);
            if (isSigned) {
                if (num > coffeeEngine.byteReader.int16_HLF) num -= coffeeEngine.byteReader.int16_LIM;
            }
            return num;
        },
        Read4Bytes:(byteArray,offset,isSigned) => {
            let num = coffeeEngine.byteReader.ReadBytes(byteArray,offset,4);
            if (isSigned) {
                if (num > coffeeEngine.byteReader.int32_HLF) num -= coffeeEngine.byteReader.int32_LIM;
            }
            return num;
        },
        ReadBytes:(byteArray,offset,length) => {
            let string = "";

            for (let index = 0; index < length; index++) {
                const stringifiedNum = byteArray[offset + index].toString(16);
                string = (stringifiedNum.length > 1 ? stringifiedNum :`0${stringifiedNum}`) + string;
            }
    
            return Number(`0x${string}`);
        },
        //Gives back the byte array
        ReadBytesRaw:(byteArray,offset,length) => {
            const returned = [];
            for (let index = 0; index < length; index++) { returned.push(byteArray[offset + index]); }
            return new Uint8Array(returned);
        },

        //Gives a string
        ReadString:(byteArray,offset,length) => {
            let string = "";
            for (let index = 0; index < length; index++) {
                const character = String.fromCharCode(coffeeEngine.byteReader.ReadBytes(byteArray,offset + index,1));
                if (coffeeEngine.byteReader.ReadBytes(byteArray,offset + index,1) >= 10) {
                    string += character;
                }
            }
            return string;
        },

        //Float function
        ReadFloat32:(byteArray,offset) => { 
            const bytes = coffeeEngine.byteReader.ReadBytesRaw(byteArray,offset,4);
            const dataView = new DataView(bytes.buffer);
            dataView.setUint8(0, bytes[3]);
            dataView.setUint8(1, bytes[2]);
            dataView.setUint8(2, bytes[1]);
            dataView.setUint8(3, bytes[0]);
            return dataView.getFloat32(0);
        }
    }
})();