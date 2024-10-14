export const handlingCommand = (data) => {
      if (data.toString().includes('up')) {
        return 'up';
      }
    
      if (data.toString().includes('cd')) {
        return 'cd';
      }
    
      if (data.toString().includes('ls')) {
        return 'ls';
      }
    
      if (data.toString().includes('cat')) {
        return 'cat';
      }
    
      if (data.toString().includes('add')) {
        return 'add';
      }
    
      if (data.toString().includes('rn') && !data.toString().includes('username')) {
        return 'rn';
      }
    
      if (data.toString().includes('cp') && !data.toString().includes('cpus')) {
        return 'cp';
      }
  
      if (data.toString().includes('mv')) {
        return 'mv';
      }
    
      if (data.toString().includes('rm')) {
        return 'rm';
      }
    
      if (data.toString().includes('os')) {
        return 'os';
      }
    
      if (data.toString().includes('hash')) {
        return 'hash';
      }
    
      if (data.toString().includes('compress') && !data.toString().includes('decompress')) {
        return 'compress';
      }
    
      if (data.toString().includes('decompress')) {
        return 'decompress';
      }

      if (data.toString().includes('.exit')) {
        return 'exit';
      }
}