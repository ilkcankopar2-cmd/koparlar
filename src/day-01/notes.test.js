import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { addNote, findNotes, removeNote } from "./notes.js";

describe("gün 1 — bellek içi not defteri", () => {
  it("boş metin eklemez", () => {
    assert.throws(() => addNote([], "   "), /metin/);
  });

  it("notu yeni diziye ekler ve eskisini değiştirmez", () => {
    const before = [];
    const after = addNote(before, "  süt al  ");
    assert.deepEqual(before, []);
    assert.equal(after.length, 1);
    assert.equal(after[0].id, 1);
    assert.equal(after[0].text, "süt al");
  });

  it("id'yi bir önceki en büyük değerin üstüne yazar", () => {
    const first = addNote([], "a");
    const second = addNote(first, "b");
    assert.equal(first.length, 1);
    assert.equal(second[1].id, 2);
    assert.equal(second[0].text, "a");
  });

  it("id ile siler ve eski diziyi bırakır", () => {
    const notes = [
      { id: 1, text: "a" },
      { id: 2, text: "b" },
    ];
    const left = removeNote(notes, 1);
    assert.deepEqual(left, [{ id: 2, text: "b" }]);
    assert.equal(notes.length, 2);
  });

  it("olmayan id'de hata verir", () => {
    assert.throws(() => removeNote([{ id: 1, text: "a" }], 9), /bulunamadı/);
  });

  it("metnin içinde arar, büyük küçük harf bakmaz", () => {
    const notes = [
      { id: 1, text: "Süt al" },
      { id: 2, text: "ekmek" },
    ];
    assert.deepEqual(findNotes(notes, "SÜT"), [{ id: 1, text: "Süt al" }]);
  });

  it("boş aramada hepsinin kopyasını döndürür", () => {
    const notes = [{ id: 1, text: "a" }];
    const found = findNotes(notes, "  ");
    assert.deepEqual(found, notes);
    assert.notEqual(found, notes);
  });
});
