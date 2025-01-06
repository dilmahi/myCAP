namespace bookshop.mr;

using {
    cuid,
    managed
} from '@sap/cds/common';


entity DT_USER : cuid, managed {

    fname : String(250);
    lname : String(250);
    email : String(250);
    pwd   : String(250);
    toFavBooks : Association to many DT_FAV
                        on toFavBooks.usermail = email;
    toRecmBooks : Association to many DT_RECM
                        on toRecmBooks.recmusremail = email;                        
                                        
};

entity DT_BOOKS : cuid, managed {

    obookid : String(250);
    name : String(250);
    author : String(250);
    category : String(250);
    usremail : String(250);
    toFavBooks: Association to many DT_FAV
                    on toFavBooks.obookid = obookid;    
    toRecBooks: Association to many DT_FAV
                    on toRecBooks.obookid = obookid;                        

};

entity DT_FAV : cuid, managed {

    key obookid : String(250);
        usermail : String(250);
        toBooks: Association to many DT_BOOKS
                    on toBooks.obookid = obookid;  

};

entity DT_RECM : cuid , managed {

    key obookid : String(250);
        recmusremail : String(250);
        toBooks: Association to many DT_BOOKS
                    on toBooks.obookid = obookid;          

}

