/**
  * TC-I2C-UK_EDUBOARD
  */

  enum ADDRESS {                    
    //% block=0x18
    A30 = 0x18,               // 
    //% block=0x19
    A31 = 0x21,                // 
    //% block=0x1A
    A32 = 0x1A,                // 
    //% block=0x1B
    A33 = 0x1B,                // 
}

  //% color="#275C6B" icon="\uf1ca weight=95 block="I2C-UK-Bin_EduBoard"
namespace i2cBinEduBoard {
    let BINEDUBOARD_I2C_ADDR = 0x18 
    let TactSwReading = 0;
    let BinSwReading = 0;
    let ledData = [0, 0, 0];

    //% block="Set the i2c Address |addr %addr" 
    //% weight=110 
    export function setAddr(addr: ADDRESS) {
        BINEDUBOARD_I2C_ADDR = addr;
    }

    function readSW(): void {
        let readbuf = pins.i2cReadBuffer(BINEDUBOARD_I2C_ADDR, pins.sizeOf(NumberFormat.UInt8LE) * 2)
        BinSwReading = readbuf[1];
        TactSwReading = readbuf[0];
    }
    
    function swap8(val : number): number {     
        return  ((val & 0x1) << 7) | ((val & 0x2) << 5) | ((val & 0x4) << 3) | ((val & 0x8) << 1) |  
        ((val >> 1) & 0x8) | ((val >> 3) & 0x4) | ((val >> 5) & 0x2) | ((val >> 7) & 0x1); 
    }

    /**
     * Read Binary Switches from Binary EduBoard.
     */
    //% blockId="binEduBoard_read_bin" block="i2c,Read_Binary"
    //% weight=100 
    export function readBinary(): number {
        readSW();
        return ~(swap8(BinSwReading));       
    }

    /**
     * Query Toggle Switch from Binary EduBoard at position x.
     */
    //% blockId="is_switch_toggle"
    //% block="Binary Switch state at Position %pos"
    //% pos.min=0 pos.max=7
    //% weight=90 
    export function isSwitchToggle(pos: number): boolean {
        readSW();
        return ((BinSwReading & (0x1 << (7-pos))) == 0 )
    }

    /**
     * Query Tactile Switch 0 or 1.
     */
    //% blockId="is_switch_press"
    //% block="Tactile Switch state at Position %pos"
    //% pos.min=0 pos.max=1
    //% weight=80 
    export function isSwitchPressed(pos: number): boolean {
        readSW();
        return ((TactSwReading & (0x1 << (pos))) == 0 )
    }

    function writeBinEduBoardI2C(byte1: number, byte2: number, byte3: number): void {
        ledData[0] = byte1;
        ledData[1] = byte2;
        ledData[2] = byte3;
        
        pins.i2cWriteBuffer(
            BINEDUBOARD_I2C_ADDR,
            Buffer.fromArray(ledData),
            false
            );
    }

    /**
     * Display Refresh.
     */
    //% blockId="display_refresh"
    //% block="Refresh LED Display"
    //% weight=70 
    export function refreshDisplay(): void {
        writeBinEduBoardI2C(0x00, 0x00, 0x00);
    }


    /**
     * Display Digit at position.
     */
    //% blockId="display_digit"
    //% block="Display (Hex) %hexDigit at Position %pos with Decimal Pt. %decimal"
    //% hexDigit.min=0 hexDigit.max=15
    //% pos.min=1 pos.max=4
    //% weight=60 
    export function set7SegLED(hexDigit:number, pos: number = 1, decimal:boolean): void {
        let displayBinary = (hexDigit & 0x0F) | (decimal ? 0x10 : 0x00);
        writeBinEduBoardI2C(pos, displayBinary, 0x00);
    }

    /**
     * Display Custom Digit at position.
     */
    //% blockId="display_custom_digit"
    //% block="Display Custom Segments at Position %pos with Segments A %a , Segments B %b, Segments C %c, Segments D %d, Segments E %e, Segments F %f, Segments G %g and Decimal Pt. %decimal"
    //% pos.min=1 pos.max=4
    //% weight=55 
    export function setUser7SegLED(pos: number = 1, a: boolean, b: boolean, c: boolean, 
    d: boolean, e: boolean, f: boolean, g: boolean, decimal:boolean): void {
        let displayBinary = (decimal ? 0x80:0) | (g ? 0x40:0) | (f ? 0x20:0) | (e ? 0x10:0) | (d ? 0x08:0) | (c ? 0x04:0) | (b ? 0x02:0) | (a ? 0x01:0);
        writeBinEduBoardI2C(pos, 0xAA, displayBinary);
    }


    /**
     * Display Binary LED.
     */
    //% blockId="display_binary"
    //% block="Display (Binary) %val on LED array"
    //% val.min=0 val.max=255
    //% weight=50 
    export function setBinaryLED(val: number): void {
        writeBinEduBoardI2C(0x05, 0x00, swap8(val));
    }

    /**
     * Display Traffic LED.
     */
    //% blockId="display_trafficlight"
    //% block="Set red %r_val ,yellow %y_val ,green %g_val and ClockColon %c_val LED States"
    //% weight=40 
    export function setIndicatorLED(r_val: boolean, y_val: boolean, g_val: boolean, c_val: boolean): void {
        let displayBinary = (c_val ? 0x80: 0x00) | (r_val ? 0x04: 0x00) | (y_val ? 0x02: 0x00) | (g_val ? 0x01: 0x00);
        writeBinEduBoardI2C(0x06, 0x00, displayBinary);
    }

}
