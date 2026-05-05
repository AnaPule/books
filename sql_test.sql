
select * from "room";
select * from "book";
select * from "user";
select * from "word";
select * from "genre";
select * from "quote";
select * from "author";

select * from "user_book";
select * from "used_token";
select * from "notification";

select * from "member";
select * from "comment" where "quiet_room" = true;
select * from "comment_interaction";

select * from member m
inner join room r on m.room_id = r.id
where m.user_id = '71e4f283-35aa-4ae0-ae74-e9e93b96e0a3';

Delete from "book";
Delete from "user";
Delete from "member";
Delete from "word";
Delete from "quote";
Delete from "room";
Delete from "author";
Delete from "genre";
delete from "user_book";
Delete from "used_token";
delete from notification;
delete from "comment_interaction";

drop table "author";
drop table "book";
drop table "notification"
