import { portfolioItems } from "../portfolioData"

describe("portfolioData", () => {
  describe("portfolioItems", () => {
    it("should contain valid portfolio entries", () => {
      expect(portfolioItems).toHaveLength(5)

      portfolioItems.forEach((item) => {
        expect(item).toHaveProperty("title")
        expect(item).toHaveProperty("description")
        expect(item).toHaveProperty("href")

        expect(typeof item.title).toBe("string")
        expect(typeof item.description).toBe("string")
        expect(typeof item.href).toBe("string")

        expect(item.title.length).toBeGreaterThan(0)
        expect(item.description.length).toBeGreaterThan(0)
        expect(item.href.length).toBeGreaterThan(0)
      })
    })

    it("should have valid URLs", () => {
      portfolioItems.forEach((item) => {
        expect(item.href).toMatch(/^https?:\/\//)
      })
    })

    it("should contain expected portfolio items", () => {
      const titles = portfolioItems.map((item) => item.title)
      expect(titles).toContain("Asa's Comeback: A Display of Versatility in The Music Industry")
      expect(titles).toContain("The Wastepreneurs: Africa's Creativity in Upcycling and Recycling")
    })

    it("should have unique titles", () => {
      const titles = portfolioItems.map((item) => item.title)
      const uniqueTitles = new Set(titles)
      expect(uniqueTitles.size).toBe(titles.length)
    })

    it("should have unique URLs", () => {
      const urls = portfolioItems.map((item) => item.href)
      const uniqueUrls = new Set(urls)
      expect(uniqueUrls.size).toBe(urls.length)
    })

    it("should have descriptions that are not too short", () => {
      portfolioItems.forEach((item) => {
        expect(item.description.length).toBeGreaterThan(20)
      })
    })
  })
})
