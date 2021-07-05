export const i = (TAG?: string, ...optionalParameters: any[]) => {
  if (!TAG) {
    TAG = '(null)'
  }
  console.log(`\n\n${TAG}: ${JSON.stringify(optionalParameters)}`)
}

export const d = (TAG?: string, ...optionalParameters: any[]) => {
  if (!TAG) {
    TAG = '(null)'
  }
  console.log(`\n\nTimestamp: ${new Date().getTime()} - ${TAG}: ${JSON.stringify(optionalParameters)}`)
}
