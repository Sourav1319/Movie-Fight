
 const autocompleteconfig={
 	renderoption:(movie)=>{
		const imgsrc=movie.Poster==='N/A'?'':movie.Poster;
		return `
		
				<img src="${imgsrc}"/>
				${movie.Title}        ${movie.Year}

		`;
	},

	inputvalue(movie){
		return movie.Title;
	},
	async fetchdata(searchterm){
	const response=await axios.get("http://www.omdbapi.com/",{
		params:{
			apikey:'bfd75cf',
			s:searchterm
		}
	})
	if(response.data.Error)
		return [];

	return response.data.Search;
	}
 }
createautocomplete({
	root:document.querySelector('.left-autocomplete'),
	onselect(movie){
		document.querySelector('.tutorial').classList.add('is-hidden');
		showmovie(movie,document.querySelector('.left-summary'),'left');
	},
	...autocompleteconfig
})
createautocomplete({
	root:document.querySelector('.right-autocomplete'),
	onselect(movie){
		document.querySelector('.tutorial').classList.add('is-hidden');
		showmovie(movie,document.querySelector('.right-summary'),'right');
	},
	...autocompleteconfig
})
let leftmovie;
let rightmovie;
const showmovie=async(movie,target,side)=>{
	const response=await axios.get("http://www.omdbapi.com/",{
		params:{
			apikey:'bfd75cf',
			i:movie.imdbID
		}
	})
	target.innerHTML=movietemplate(response.data);
	if(side==="right")
		rightmovie=response.data;
	else
		leftmovie=response.data;
	if(leftmovie&&rightmovie)
		runcomparison();
	
}

const runcomparison = () => {
  const leftSideStats = document.querySelectorAll(
    '.left-summary .notification'
  );
  const rightSideStats = document.querySelectorAll(
    '.right-summary .notification'
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    const leftSideValue = leftStat.dataset.value;
    const rightSideValue = rightStat.dataset.value;

    if (rightSideValue > leftSideValue) {
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
     else if(rightSideValue<leftSideValue) {
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }
  });
};
const movietemplate=(moviedetail)=>{
	const metascore=parseInt(moviedetail.Metascore);
	const imdbvotes=parseInt(moviedetail.imdbVotes);
	const imdbrating=parseFloat(moviedetail.imdbRating);
	const boxoffice=parseInt(moviedetail.BoxOffice.replace(/\$/,'').replace(/\,/,''))
	const awards=moviedetail.Awards.split(' ').reduce((prev,word)=>{
		let val=parseInt(word);
		if(isNaN(val))
			return prev;
		else
			return prev+val;
	},0);
return `
	<article class="media"> 
	 <figure class="media-left">
	  <p class="image">
	   <img src="${moviedetail.Poster}">
	  </p>
	 </figure>
	 <div class="media-content">
	  <div class="content">
	   <h1>${moviedetail.Title}</h1>
	   <h4>${moviedetail.Genre}</h4>
	   <p>${moviedetail.Plot}</p>
	  </div>
	 </div>
	</article>
	<article data-value=${awards} class="notification is-primary">
	 <p class="title">${moviedetail.Awards}</p>
	 <p class="subtitle">Awards</p>
	</article>
	<article data-value=${imdbrating} class="notification is-primary">
	 <p class="title">${moviedetail.imdbRating}</p>
	 <p class="subtitle">IMDB Rating</p>
	</article>
	<article data-value=${boxoffice} class="notification is-primary">
	 <p class="title">${moviedetail.BoxOffice}</p>
	 <p class="subtitle">BoxOffice Collection</p>
	</article>
	<article data-value=${metascore} class="notification is-primary">
	 <p class="title">${moviedetail.Metascore}</p>
	 <p class="subtitle">Metascore Rating</p>
	</article>
	<article data-value=${imdbvotes} class="notification is-primary">
	 <p class="title">${moviedetail.imdbVotes}</p>
	 <p class="subtitle">IMDB Votes</p>
	</article>
`
}