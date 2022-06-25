//add event listener to make update button work
document.getElementById('deleteButton').addEventListener('click', deleteEntry)  //event listener when click delete button. run deleteEntry async func, grab value name of input box. pass to server, delete entry, send response
document.getElementById('updateButton').addEventListener('click', updateEntry)

async function deleteEntry(){
    const input = document.getElementById("deleteInput")
    console.log(input.value)
    try{                                                           //try catch log. client side pass info up to server
        const response = await fetch('deleteEntry', {          //create fetch to path deleteEntry and instead of pull data, method delete data 
            method: 'delete',
            headers: {'Content-Type': 'application/json'},     //tell server json data incoming
            body: JSON.stringify({                            //body we are passing is json/stringify
                name: input.value             //value of whatever is in input box and send to server to delete
            })
        })
        const data = await response.json()          //client awaiting response from server data was deleted
        console.log(data)
        location.reload()                           //reload page
    }catch(err) {
        console.log(err)
    }
}


//async await - instead of using promises to fetch, use async
async function updateEntry(){
    try {
        const response = await fetch('updateEntry', {          //visit updateEntry and run put
            method: 'put',
            headers: {'Content-Type': 'application/json'},  //tells json data incoming
            body: JSON.stringify({                      //turns everything into a string
                name: document.getElementsByName('name')[0].value,                //go in form and extract out each entry for each field
                speciesName: document.getElementsByName('speciesName')[0].value,   //[0] to pull out first element in array to not grab all
                features: document.getElementsByName('features')[0].value,
                homeworld: document.getElementsByName('homeworld')[0].value,
                image: document.getElementsByName('image')[0].value,
                interestingFacts: document.getElementsByName('interestingFact')[0].value,
                notableExamples: document.getElementsByName('notableExamples')[0].value     //[0] so it grabs first item from each field insted of all input
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    } catch(err) {
        console.log(err)
    }
}

