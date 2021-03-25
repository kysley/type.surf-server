const CONSTANT = 0.07

function convertExpToLevel(exp: number) {
  return CONSTANT * Math.sqrt(exp)
}

function convertLevelToExp(level: number) {
  return Math.pow(level / CONSTANT, 2)
}

const conditions = [
  // completed
  (record: any) => 100,
]
