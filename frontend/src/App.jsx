import axios from "axios";
import { useState } from "react";
import * as XLSX from "xlsx"
function App() {
  const [msg,setmsg]= useState("")
  const[status,setstatus]=useState(false)
  const[emailList,setemailList]=useState([])

   function handlemsg(evt){
    setmsg(event.target.value)

   }

   function handlefile(event){
        const file=event.target.files[0]
    console.log(file)
    const reader = new FileReader();
    
    reader.onload=function(e){
        const data = e.target.result
        const workbook = XLSX.read(data,{type:"binary"})
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail = emailList.map(function(item){return item.A})
        console.log(totalemail)
        setemailList(totalemail)
    }

    reader.readAsBinaryString(file)

   }



   function send(){
    setstatus(true)
    axios.post("http://localhost:5000/sendmail",{msg:msg , emailList:emailList})
    .then(function(data){

      if(data.data === true)
      {
        alert("email sent successfully")
        setstatus(false)
      }
      else{
        alert("not send")
      }
    }).catch(function(error){
      console.log(error);
    })
   }


  return (
    <div className="min-h-screen bg-blue-400">

      <div className="bg-blue-950 text-white text-center py-5">
        <h1 className="text-2xl font-bold">BulkMail</h1>
      </div>

  
      <div className="bg-blue-800 text-white text-center py-4">
        <p className="font-semibold">
          We can help your business with sending multiple emails at once
        </p>
      </div>


      <div className="bg-blue-600 text-white text-center py-4">
        <h2 className="font-bold text-lg">Drag and Drop</h2>
      </div>

  
      <div className="max-w-xl mx-auto px-6 py-5">

      
        <textarea onChange={handlemsg} value={msg}
          placeholder="Enter the email text ..."
          className="w-full h-32 p-3 rounded-md border-2 border-gray-300 outline-none resize-none"
        />

      
        <div className="mt-5 border-4 border-dashed border-white p-5 text-center">
          <input 
            type="file"
            onChange={handlefile}
    
            className="bg-white p-2 rounded"
          />
        </div>

      
        <div>
          
          <p className="text-center text-gray-800 font-semibold mt-6">
          Total Emails in the file: {emailList.length}
        </p>
        </div>


  
      

        <div className="text-center mt-4">
          <button onClick={send}
            className="bg-blue-950 text-white font-bold px-6 py-3 rounded-md hover:bg-blue-900"
          >{status?"sending....":"send"}
            
          </button>
        </div>

      </div>
    </div>
  );
}

export default App;