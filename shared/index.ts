export interface Model {
  name: string
}

export interface UiConfig {
  ui: {
    banner: {
      enabled: boolean
      text: string
      colour: string
    }
  }
}
