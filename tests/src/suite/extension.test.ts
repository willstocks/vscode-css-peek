import * as assert from "assert";
import { before } from "mocha";
import * as vscode from "vscode";
import { TextDocument as ServerTextDocument } from "vscode-languageserver";

import findSelector from "../../../server/out/core/findSelector";
import { create } from "../../../server/out/logger";

suite("Extension Tests", () => {
  let document: vscode.TextDocument;
  let document2: ServerTextDocument;

  before((done) => {
    console.log("before");
    // @ts-ignore
    create(console);
    vscode.workspace
      .openTextDocument(`${vscode.workspace.workspaceFolders[0]}/example.html`)
      .then(
        (doc) => {
          document = doc;
          document2 = ServerTextDocument.create(
            doc.uri.toString(),
            doc.languageId,
            doc.version,
            doc.getText()
          );
          done();
        },
        (error) => {
          done(error);
        }
      );
  });

  // Defines a Mocha unit test
  suite("findSelector", () => {
    const classTestPos: vscode.Position = new vscode.Position(3, 17);
    const idTestIDPos: vscode.Position = new vscode.Position(3, 35);
    const idTest2Pos: vscode.Position = new vscode.Position(6, 19);
    const h1Pos: vscode.Position = new vscode.Position(3, 6);
    // const idCommonPos: vscode.Position = new vscode.Position(4, 43);

    // const invalidPos: vscode.Position = new vscode.Position(1000, 19);
    const notAnAttributePos: vscode.Position = new vscode.Position(5, 11);
    const notAnAttributePos2: vscode.Position = new vscode.Position(3, 48);

    test("can find the right id selector in a simple 'testID' case", () => {
      assert.ok(document);
      const selector: {
        attribute: string;
        value: string;
      } = findSelector(document2, idTestIDPos, { supportTags: true });
      assert.equal(selector.attribute, "id");
      assert.equal(selector.value, "testID");
    });

    test("can find the right class selector in a simple 'test' case", () => {
      assert.ok(document);
      const selector: {
        attribute: string;
        value: string;
      } = findSelector(document2, classTestPos, { supportTags: true });
      assert.equal(selector.attribute, "class");
      assert.equal(selector.value, "test");
    });

    test("can find the right id selector after an HTML comment", () => {
      assert.ok(document);
      const selector: {
        attribute: string;
        value: string;
      } = findSelector(document2, idTest2Pos, { supportTags: true });
      assert.equal(selector.attribute, "id");
      assert.equal(selector.value, "test-2");
    });

    test("can find an HTML tag", () => {
      assert.ok(document);
      const selector: {
        attribute: string;
        value: string;
      } = findSelector(document2, h1Pos, { supportTags: true });
      assert.equal(selector.attribute, null);
      assert.equal(selector.value, "h1");
    });

    test("disabling `supportTags` configuration setting works correctly", () => {
      assert.ok(document);
      const selector: {
        attribute: string;
        value: string;
      } = findSelector(document2, h1Pos, { supportTags: false });
      assert.equal(selector, null);
    });

    test("throws an error for an invalid position", () => {
      assert.ok(document);
      let selector: {
        attribute: string;
        value: string;
      } = findSelector(document2, notAnAttributePos, { supportTags: true });
      assert.equal(selector, null);
      selector = findSelector(document2, notAnAttributePos2, {
        supportTags: true,
      });
      assert.equal(selector, null);
    });
  });

  //TODO: Add tests to actually query the definition from the document and ensure definitions are found
});
