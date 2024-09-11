

const asyncHoler =  (fn)=>{
  return (req, res, next) =>{
    fn(req,res,next).catch(next);
  }
}

module.exports = asyncHoler;