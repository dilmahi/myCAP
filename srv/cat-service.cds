using bookshop.mr as bookshop from '../db/data-model';

service  CatalogService {

    entity User as projection on bookshop.DT_USER;
    entity Books as projection on bookshop.DT_BOOKS;
    entity FavBooks as projection on bookshop.DT_FAV;
    entity RecmBooks as projection on bookshop.DT_RECM;

}