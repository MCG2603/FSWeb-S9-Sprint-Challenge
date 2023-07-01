import React from "react"
import {render, screen, waitFor, fireEvent} from "@testing-library/react"
import AppFunctional from "./AppFunctional";
import '@testing-library/jest-dom/extend-expect'

// Write your tests here
test('sanity', () => {
  expect(true).toBe(true)
})

test('hata olmadan render ediliyor mu?', () => {
  render(<AppFunctional />);
})

test('reset butonu çalışıyor mu?', () => {
  render(<AppFunctional />);

  const resetButton = screen.getByText("reset");
  fireEvent.click(resetButton);


  expect(reset).toBeInTheDocument();
})

test("başlangıçta x ve y koordinatları doğru gösteriliyor ", () => {
  render (<AppFunctional />)

  const kareler = screen.getByText(/koordinatlar/i)

  expect(kareler).toHaveTextContent("(2,2)")
});

test("yukarı basınca koordinatları doğru gösteriyor", () => {
  render (<AppFunctional />)

  const up = screen.getByText(/koordinatlar/i)
  const upButton = screen.getByText("YUKARI")

  fireEvent.click(upButton);
  expect(up).toHaveTextContent("(2,1)")
})

test("2 kez yukarı basınca hata mesajıı gösteriyor", () => {
  render (<AppFunctional />)

  const mesaj =  document.querySelector('#message')
  const upButton = screen.getByText("YUKARI")

  fireEvent.click(upButton);
  fireEvent.click(upButton);

  expect(mesaj).toHaveTextContent("Yukarıya gidemezsiniz")
})

test("hatalı email girildiğinde hata mesajı veriyor", async () => {
  render (<AppFunctional />)

  const mailInput = document.querySelector('#email')
  const button = document.querySelector('#submit')

  fireEvent.change(mailInput, {target: {value:"aasdfg@foo.bar"}});
  fireEvent.click(button);

  await waitFor(() => {
    const message = screen.queryByText("Ouch: email must be valid email");
    expect(message).toBeInTheDocument;
   })
})

test("doğru email girildiğinde başarı mesajı veriyor", async () => {
  render (<AppFunctional />)

  const mailInput = document.querySelector('#email')
  const button = document.querySelector('#submit')

  fireEvent.change(mailInput, {target: {value:"aasdfg@gmail.com"}});
  fireEvent.click(button);

 await waitFor(() => {
  const message = screen.queryByText(/win/i);
  expect(message).toBeInTheDocument;
 })


})
