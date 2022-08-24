import fs from "fs"

interface Environment {
  DB_URI: string,
  APP_PORT: number,
  EMAIL_ADDRESS: string,
  EMAIL_APP_PASS: string
}

interface Config {
  production: Environment,
  development: Environment,
  local: Environment
}

// Config Singleton (clase que solo se instancia una vez), 
// para así solo leer el archivo config-json una sola vez y no leerlo cada vez que se necesite
class ConfigHandler {
  private config: Config
  private static instance: ConfigHandler

  private constructor() { 
    this.config = JSON.parse(String(fs.readFileSync("./config-json.json")))
  }

  public static getInstance(): ConfigHandler {
    if(!ConfigHandler.instance) {
      ConfigHandler.instance = new ConfigHandler()
    }
    return ConfigHandler.instance
  }

  public getEnvironment = (): Environment => {  
    if(process.env.NODE_ENV === "production") {
      return this.config.production
    } else if(process.env.NODE_ENV === "development") {
      return this.config.development
    } else {
      return this.config.local
    }
  }
}

export const config = ConfigHandler.getInstance().getEnvironment()