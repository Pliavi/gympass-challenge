import { readFile, convertTextToJson, fasterLap } from "../src/race"

test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3)
})

test("Convert Input Text to JSON", () => {
  const expected = JSON.parse(readFile('./kart.test.json'))
  const txtInput = readFile('./kart.test.in')

  const result = convertTextToJson(txtInput)

  expect(result).toEqual(expected)
})

test("The Faster Lap", () => {
  const expected = JSON.parse(readFile('./kart.test.json'))
  const txtInput = readFile('./kart.test.in')

  const content = convertTextToJson(txtInput)
  const result = fasterLap(content).velocity

  expect(result).toBe("28,435")
})