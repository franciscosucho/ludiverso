const arrow_left =document.querySelectorAll(".arrow_left")
const arrow_right =document.querySelectorAll(".arrow_right")
var index_juego=0
arrow_left.forEach(arrow => {
    arrow.addEventListener("click",()=>{
        if(index_juego==0){
            
        }
        else{
            let cont_desac_juego=document.getElementById(`cont_main_juego_${index_juego}`)
            cont_desac_juego.classList.add("desac")

            index_juego=index_juego-1;
            let cont_active_juego=document.getElementById(`cont_main_juego_${index_juego}`)
            cont_active_juego.classList.remove("desac")
        }
    })
});

arrow_right.forEach(arrow => {
    arrow.addEventListener("click",()=>{
        if(index_juego==4){
            
        }
        else{
            let cont_desac_juego=document.getElementById(`cont_main_juego_${index_juego}`)
            cont_desac_juego.classList.add("desac")

            index_juego=index_juego+1;
            let cont_active_juego=document.getElementById(`cont_main_juego_${index_juego}`)
            cont_active_juego.classList.remove("desac")
        }
    })
});