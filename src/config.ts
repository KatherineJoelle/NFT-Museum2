
const ENV = "prd"
const DEBUG_FLAGS: Record<string,boolean> = {
    "local":true,
    "prd":false
}

class Config {
    CONFIG_CLAIM_TESTING_ENABLED = false
    init() {
    }
}

export const CONFIG = new Config()

export function initConfig() {
    CONFIG.init()
    return CONFIG
}