create table users
(
    id         bigint unsigned auto_increment primary key,
    name       varchar(100) not null,
    created_at datetime     not null default CURRENT_TIMESTAMP,
    updated_at datetime     not null default CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP
) engine = InnoDB;