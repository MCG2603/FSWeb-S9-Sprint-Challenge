import axios from 'axios'
import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [form,setForm]=useState({
    message:initialMessage,
    email:initialEmail,
    steps:initialSteps,
    index:initialIndex
  })

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
     let Y=form.index%3;
     let X=Math.floor(form.index/3);
     return [X,Y];

  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    let arr=getXY();
    arr[0]+=1
    arr[1]+=1
    return  'Koordinatlar ' +"("+arr[1] + ","+arr[0]+")"
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setForm({
      message:initialMessage,
      email:initialEmail,
      steps:initialSteps,
      index:initialIndex
  });
}

  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    console.log(yon,form.index%3,form.index)
    form.message=initialMessage;
    setForm({...form,message:form.message})
    if(yon === "left" &&  form.index%3==0){
      form.message="Sola gidemezsiniz"
    }
    if(yon === "right" &&  form.index%3==2){
      form.message="Sağa gidemezsiniz"
    }
    if(yon === "up" &&  Math.floor(form.index/3)<1){
      form.message="Yukarıya gidemezsiniz"
    }
    if(yon === "down"&& Math.floor(form.index/3)>1){
      form.message="Aşağıya gidemezsiniz"
    }
    if(yon=="left" && form.index%3!=0){
      form.index-=1;
      form.steps+=1;

    }
    if(yon=="right" && form.index%3!=2){
      
      form.index+=1;
      form.steps+=1;
    }
    if(yon=="down" && Math.floor(form.index/3)<2){
      form.index+=3;
      form.steps+=1;
    }
    if(yon=="up" && Math.floor(form.index/3)>0){
      form.index-=3;
      form.steps+=1;
 
    }
 
    setForm({...form,index:form.index,steps: form.steps,message:form.message})
    console.log(form.message);
  }

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    sonrakiIndex(evt.target.id);

  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
setForm({...form,email:evt.target.value});
  }

  function onSubmit(evt) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    evt.preventDefault();
    const [x, y] = getXY();
    const payload = {x: y+1, y: x+1, steps: form.steps ,email: form.email}
    console.log(payload);

    axios
      .post("http://localhost:9000/api/result", payload)
      .then(res => {
        setForm({...form, message: res.data.message, email:""});

        console.log(res.data)
      })
      .catch(err => { console.log(err)
        setForm({...form, message: err.response.data.message, email:""});
      })
  }

  

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{form.steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === form.index ? ' active' : ''}`}>
              {idx === form.index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{form.message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle}>YUKARI</button>
        <button id="right" onClick={ilerle}>SAĞ</button>
        <button id="down" onClick={ilerle}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" onChange={onChange} type="email" placeholder="email girin" value={form.email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
      
    }
