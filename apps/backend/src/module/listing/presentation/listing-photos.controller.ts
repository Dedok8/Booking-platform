import { Controller } from "@nestjs/common";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_PHOTOS_PER_LISTING = 10;
const MODEL = 'Listing';
const COLLECTION = 'photos';

@Controller('listing/:listingId/photos')
export class ListingPhotosController {
  constructor(
    private readonly listing:ListingRe
  ){}
}