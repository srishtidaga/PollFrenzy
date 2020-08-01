const navSlide = () => {
    const block=document.querySelector('.block');
    const nav=document.querySelector('.nav-line');
    const navline=document.querySelectorAll('.nav-line li');
     
    block.addEventListener('click', () => {
         nav.classList.toggle('nav-active');
     
     navline.forEach((link,index) => {
         if(link.style.animation){
             link.style.animation= '';
         }else{
            link.style.animation=`navLineFade 0.5s ease forwards ${index/7 + 0.3}s`;
         
         } 
     
        });
        block.classList.toggle('toggle');    
     });
    }
     navSlide();
