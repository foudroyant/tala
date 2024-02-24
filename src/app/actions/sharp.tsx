'use server'
//import sharp from "sharp";
import Jimp from "jimp";

export default async function resizeAndOptimizeImage(
    inputPath : string, 
    outputPath : string, 
    maxWidth : number, 
    maxHeight : number, 
    quality : number, 
    format : string
    ) {
    /*const moule = await sharp(inputPath)
    const details = await moule.metadata()
    console.log(details)

      if(details.width != undefined && details.height!= undefined){
        await moule.resize({
            width: Math.floor(details.width/2),
            height: Math.floor(details.height/2),
            fit: 'cover', // Utiliser 'cover' si vous souhaitez remplir exactement les dimensions spécifiées
          })
          .jpeg({ quality })
          .toFile(outputPath);
      }*/

    // Extraire le type de l'image (par exemple, png, jpeg)
    const matches = inputPath.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/)+"";
    const type = matches[1];
    const data = matches[2];

    // Créer un Buffer à partir des données base64
    const buffer = Buffer.from(data, 'base64');
    console.log(buffer)
      await Jimp.read(buffer, (err, image) => {
        if (err) throw err;
        console.log(image)
        image
          .resize(256, 256) // resize
          .quality(60) // set JPEG quality
          .greyscale() // set greyscale
          .write(outputPath); // save
      });
      return outputPath
  }