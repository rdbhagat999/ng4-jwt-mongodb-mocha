import { Ng4AwtMongodbMochaTodosPage } from './app.po';

describe('ng4-awt-mongodb-mocha-todos App', () => {
  let page: Ng4AwtMongodbMochaTodosPage;

  beforeEach(() => {
    page = new Ng4AwtMongodbMochaTodosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
