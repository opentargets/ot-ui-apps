import type { Page } from "@playwright/test";

export class DiseasePage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getProfilePage() {
    return this.page.url().replace(/\/associations$/, "");
  }

  async goToProfilePage() {
    await this.page.goto(this.getProfilePage());
  }
}
