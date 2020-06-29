create sequence ownership_status_ownership_status_type_seq;

alter sequence ownership_status_ownership_status_type_seq owner to postgres;

create table library_branch
(
    library_id   uuid default uuid_generate_v4() not null
        constraint library_branch_pk
            primary key,
    library_name varchar(50)                     not null,
    "createdAt"  timestamp,
    "updatedAt"  timestamp
);

alter table library_branch
    owner to postgres;

create table member_type
(
    member_type_id          serial      not null
        constraint member_type_pk
            primary key,
    member_type_description varchar(20) not null
);

alter table member_type
    owner to postgres;

create table library_branch_member
(
    member_id           uuid default uuid_generate_v4() not null
        constraint library_branch_member_pk
            primary key,
    library_branch_fk   uuid                            not null
        constraint library_branch_member_fk
            references library_branch,
    member_type_fk      integer                         not null
        constraint library_branch_member_member_type_fk
            references member_type,
    member_mail_address varchar(100)                    not null,
    member_password     varchar(100)                    not null
);

alter table library_branch_member
    owner to postgres;

create unique index library_branch_member_member_mail_address_uindex
    on library_branch_member (member_mail_address);

create table library_item_type
(
    id                       serial      not null
        constraint library_item_type_pk
            primary key,
    library_item_description varchar(20) not null
);

alter table library_item_type
    owner to postgres;

create table library_item
(
    library_item_id      uuid default uuid_generate_v4() not null
        constraint library_item_pk
            primary key,
    library_item_type_fk integer
        constraint library_item__fk
            references library_item_type
);

alter table library_item
    owner to postgres;

create table library_item_instance_status
(
    library_item_instance_status_type             serial      not null
        constraint library_instance_status_pk
            primary key,
    library_item_instance_status_type_description varchar(20) not null
);

alter table library_item_instance_status
    owner to postgres;

create table library_item_instance
(
    library_item_instance_id uuid default uuid_generate_v4() not null
        constraint library_item_instance_pk
            primary key,
    library_item_fk          uuid                            not null
        constraint library_item_instance__fk
            references library_item,
    library_instance_status  integer
        constraint library_item_instance_library_item_instance_status_library_item
            references library_item_instance_status,
    library_branch_fk        uuid
        constraint library_item_instance_library_branch_library_id_fk
            references library_branch
);

alter table library_item_instance
    owner to postgres;

create table library_item_instance_history
(
    library_item_instance_history_id uuid      default uuid_generate_v4() not null
        constraint library_item_instance_history_pk
            primary key,
    library_item_instance_fk         uuid                                 not null
        constraint library_item_instance_history_library_item_instance_library_ite
            references library_item_instance,
    library_item_instance_renter_fk  uuid                                 not null
        constraint library_item_instance_history_library_branch_member_member_id_f
            references library_branch_member,
    rent_start_date                  timestamp default now()              not null,
    rent_end_date                    timestamp,
    is_active                        boolean   default true               not null
);

alter table library_item_instance_history
    owner to postgres;

create table ownership_status
(
    ownership_status_type        integer default nextval(
            '"LibraryAutomation".ownership_status_ownership_status_type_seq'::regclass) not null
        constraint ownership_status_pk
            primary key,
    ownership_status_description varchar                                                not null
);

alter table ownership_status
    owner to postgres;

create table library_item_instance_ownership_information
(
    library_item_instance_fk uuid      not null
        constraint library_item_instance_ownership_information_pk
            primary key
        constraint library_item_instance_ownership_information_library_item_instan
            references library_item_instance,
    ownership_status_fk      integer   not null
        constraint library_item_instance_ownership_information_ownership_status_ow
            references ownership_status,
    owner_fk                 uuid
        constraint library_item_instance_ownership_information_library_branch_memb
            references library_branch_member,
    library_branch_fk        uuid      not null
        constraint library_item_instance_ownership_information_library_branch_libr
            references library_branch,
    "createdAt"              timestamp not null,
    "updatedAt"              timestamp
);

alter table library_item_instance_ownership_information
    owner to postgres;

create table author
(
    author_id   uuid default uuid_generate_v4() not null
        constraint author_pk
            primary key,
    author_name varchar(30)                     not null
);

alter table author
    owner to postgres;

create table library_item_info
(
    library_item_fk             uuid not null
        constraint library_item_info_pk
            primary key
        constraint library_item_info_library_item_fk
            references library_item,
    library_item_author_fk      uuid not null
        constraint library_item_info_author_author_id_fk
            references author,
    library_item_published_date date not null,
    library_item_name           varchar(30)
);

alter table library_item_info
    owner to postgres;

create table library_item_on_hold_history
(
    library_item_on_hold_history_id uuid      default uuid_generate_v4() not null
        constraint library_item_on_hold_history_pk
            primary key,
    library_item_fk                 uuid                                 not null
        constraint library_item_on_hold_history_library_item_library_item_id_fk
            references library_item,
    on_hold_member_fk               uuid                                 not null
        constraint library_item_on_hold_history_library_branch_member_member_id_fk
            references library_branch_member,
    create_date                     timestamp default now()              not null,
    update_date                     timestamp,
    is_active                       boolean   default true               not null
);

alter table library_item_on_hold_history
    owner to postgres;

create table users
(
    id          serial                   not null
        constraint users_pkey
            primary key,
    email       varchar(255)             not null
        constraint users_email_key
            unique,
    password    varchar(255)             not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);

alter table users
    owner to postgres;

create table library_business_service
(
    id          serial                   not null
        constraint library_business_service_pkey
            primary key,
    text        varchar(255)             not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);

alter table library_business_service
    owner to postgres;

create table rentabook
(
    id          serial                   not null
        constraint rentabook_pkey
            primary key,
    text        varchar(255)             not null,
    "createdAt" timestamp with time zone not null,
    "updatedAt" timestamp with time zone not null
);

alter table rentabook
    owner to postgres;

