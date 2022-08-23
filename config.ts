import fs from "fs"

interface Environment {
  DB_URI: string,
  APP_PORT: number
}

interface Config {
  production: Environment,
  development: Environment,
  test: Environment
}

class ConfigHandler {
  private static instance: ConfigHandler

  private constructor() { }

  public static getInstance(): ConfigHandler {
    if(!ConfigHandler.instance) {
      ConfigHandler.instance = new ConfigHandler()
    }
    return ConfigHandler.instance
  }

  public getEnvironment = (): Environment => {
    const config: Config = JSON.parse(String(fs.readFileSync("./config-json.json")))
    if(process.env.NODE_ENV === "production") {
      return config.production
    } else if(process.env.NODE_ENV === "development") {
      return config.development
    } else {
      return config.test
    }
  }
}

export const config = ConfigHandler.getInstance().getEnvironment()