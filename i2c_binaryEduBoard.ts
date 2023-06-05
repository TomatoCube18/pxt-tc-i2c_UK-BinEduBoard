/**
  * TC-I2C-UK_EDUBOARD
  */


  enum DIGITS {
    //% block=0
    "0" = 0,
    //% block=1
    "1",
    //% block=2
    "2",
    //% block=3
    "3",
    //% block=4
    "4",
    //% block=5
    "5",
    //% block=6
    "6",
    //% block=7
    "7",
    //% block=8
    "8",
    //% block=9
    "9",
    //% block=A
    "A",
    //% block=B
    "B",
    //% block=C
    "C",
    //% block=D
    "D",
    //% block=E
    "E",
    //% block=F
    "F"

}



  //% color="#275C6B" icon="\uf1ca weight=95 block="I2C-UK-Bin_EduBoard"
namespace i2cBinEduBoard {
    let BINEDUBOARD_I2C_ADDR = 0x18 
    var TactSwReading = 0;
    var BinSwReading = 0;

    function readSW(): void {
        let readbuf = pins.i2cReadBuffer(BINEDUBOARD_I2C_ADDR, pins.sizeOf(NumberFormat.UInt8LE) * 2)
        BinSwReading = readbuf[0];
        TactSwReading = (readbuf[1] >> 6) & 0x03;
    }
    
    /**
     * Read Binary Switches from Binary EduBoard.
     */
    //% blockId="binEduBoard_read_bin" block="i2c,Read_Binary"
    //% weight=100 
    export function readBinary(): number {
        readSW();
        return BinSwReading       
    }

    /**
     * Query Toggle Switch from Binary EduBoard at position x.
     */
    //% blockId="is_switch_toggle"
    //% block="Binary Switch state at Position %pos"
    //% pos.min=1 pos.max=8
    //% weight=90 
    export function isSwitchToggle(pos: number): boolean {
        readSW();
        return ((BinSwReading & (0x1 << (pos-1))) != 0 )
    }

    /**
     * Query Tactile Switch 1 or 2.
     */
    //% blockId="is_switch_press"
    //% block="Tactile Switch state at Position %pos"
    //% pos.min=1 pos.max=2
    //% weight=80 
    export function isSwitchPressed(pos: number): boolean {
        readSW();
        return ((TactSwReading & (0x1 << (pos-1))) != 0 )
    }

    function writeBinEduBoardI2C(byte1: number, byte2: number, byte3: number): void {
        pins.i2cWriteNumber(
            BINEDUBOARD_I2C_ADDR,
            byte1,
            NumberFormat.UInt8BE,
            true
        )
        pins.i2cWriteNumber(
            BINEDUBOARD_I2C_ADDR,
            byte2,
            NumberFormat.UInt8BE,
            true
        )
        pins.i2cWriteNumber(
            BINEDUBOARD_I2C_ADDR,
            byte3,
            NumberFormat.UInt8BE,
            false
        )

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
    //% block="Display (Hex) %hexDigit at Position %pos with Decimal %decimal"
    //% pos.min=1 pos.max=4
    //% weight=60 
    export function isLineDetected(hexDigit:DIGITS, pos: number, decimal:boolean): void {
        let displayBinary = hexDigit | (decimal << 4);
        writeBinEduBoardI2C(pos, displayBinary, 0x00);
    }

    /**
     * Display Binary LED.
     */
    //% blockId="display_binary"
    //% block="Display (Hex) %val on LED array"
    //% pos.min=0 pos.max=255
    //% weight=50 
    export function isLineDetected(val: number): void {
        writeBinEduBoardI2C(0x05, 0x00, val);
    }

    /**
     * Display Traffic LED.
     */
    //% blockId="display_trafficlight"
    //% block="Set red %r_val , yellow %y_val , green %g_val and ClockColon %c_val LED"
    //% weight=40 
    export function isLineDetected(r_val: boolean, y_val: boolean, g_val: boolean, c_val: boolean): void {
        let displayBinary = (c_val << 8) | (g_val << 2) | (y_val << 1) | (r_val);
        writeBinEduBoardI2C(0x06, 0x00, val);
    }

}
