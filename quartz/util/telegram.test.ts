import test, { describe } from "node:test"
import assert from "node:assert"
import { telegramDiscussionId } from "./telegram"

describe("telegramDiscussionId", () => {
  test("post links in any form", () => {
    for (const value of [
      "https://t.me/BorozdovBlog/123",
      "http://t.me/BorozdovBlog/123",
      "t.me/BorozdovBlog/123",
      "https://t.me/s/BorozdovBlog/123",
      "https://t.me/BorozdovBlog/123?single",
      "https://t.me/BorozdovBlog/123/",
      "https://telegram.me/BorozdovBlog/123#comment",
      "BorozdovBlog/123",
      " BorozdovBlog/123 ",
    ]) {
      assert.strictEqual(telegramDiscussionId(value), "BorozdovBlog/123", value)
    }
  })

  test("bare post number uses the default channel", () => {
    assert.strictEqual(telegramDiscussionId(123, "BorozdovBlog"), "BorozdovBlog/123")
    assert.strictEqual(telegramDiscussionId("123", "BorozdovBlog"), "BorozdovBlog/123")
    assert.strictEqual(telegramDiscussionId(123), null)
  })

  test("rejects private and malformed values", () => {
    for (const value of [
      "https://t.me/c/2575094499/12",
      "https://t.me/BorozdovBlog",
      "https://example.com/BorozdovBlog/123",
      "просто текст",
      "",
      null,
      undefined,
    ]) {
      assert.strictEqual(telegramDiscussionId(value, "BorozdovBlog"), null, String(value))
    }
  })
})
