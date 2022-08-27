import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles, isValidURL, isValidFormat } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get("/filteredimage", async (req: Request, res: Response) => {
    let { image_url } = req.query

    //  1. validate the image_url query
    //    1.1. return status 400 if image_url not in query param
    if (!image_url) { return res.status(400).send("Req params must include an image_url.") };
    //    1.2. return status 400 if image_url not a valid url
    if (!isValidURL(image_url)) { return res.status(400).send("image_url must be a valid url. Vist the link for more information: https://developer.mozilla.org/en-US/docs/Web/API/URL") };
    //    1.3. return status 415 if image_url has an unsupported format
    if (!isValidFormat(image_url)) { return res.status(415).send("image format must be 'jpeg','jpg','png','bmp','tiff' or 'gif'.") };

    //  2. call filterImageFromURL(image_url) to filter the image
    filterImageFromURL(image_url).then((filepath) => {
      //  3. send the resulting file in the response
      res.status(200).sendFile(filepath, (err) => {
        if (err) {
          console.log(err);
        } else {
          try {
            //  4. deletes any files on the server on finish of the response
            deleteLocalFiles([filepath])
          } catch (e) {
            console.log("error removing ", filepath);
          }
        }
      });
      return
    }).catch((message) => {
      //    3.1 return status 422 if an unexpected error occurred.
      return res.status(422).send("The request was well-formed, but an unexpected error occurred. " + message);
    })
  })
  /**************************************************************************** */
  //! END @TODO1


  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();