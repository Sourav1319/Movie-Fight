let timeid;
const debounce=(func,delay=1000)=>{

	return(...args)=>{
		if(timeid)
			clearTimeout(timeid);
		timeid=setTimeout(()=>{
			func.apply(null,args)
		},delay)

	}
}