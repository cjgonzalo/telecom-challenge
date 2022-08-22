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
  private config: Config
  private environment: Environment
  
  constructor() {
    this.config = JSON.parse(String(fs.readFileSync("./config-json.json")))
      
    if(process.env.NODE_ENV === "production") {
      this.environment = this.config.production
    } else if(process.env.NODE_ENV === "development") {
      this.environment = this.config.development
    } else {
      this.environment = this.config.test
    }
  }

  public getEnvironment = (): Environment => {
    return this.environment
  }
}

export const config = new ConfigHandler().getEnvironment()