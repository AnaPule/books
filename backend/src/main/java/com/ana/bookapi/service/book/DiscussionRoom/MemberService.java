package com.ana.bookapi.service.book.DiscussionRoom;

import com.ana.bookapi.models.book.DiscussionRoom.Member;
import com.ana.bookapi.repository.book.MemberRepo;
import com.ana.bookapi.repository.book.RoomRepo;
import org.apache.coyote.BadRequestException;
import org.springframework.stereotype.Service;

@Service
public class MemberService {

    private MemberRepo mr;
    private RoomRepo rr;

    //constructor
    public MemberService(MemberRepo mr, RoomRepo rr) {
        this.mr = mr;
        this.rr = rr;
    }

    //count members
    public Integer getNoOfMembers(String room_id){
        if (!rr.existsById(room_id)) {
            System.err.println("Room id not found - no of members");
            return 0;
        }
        Integer count = mr.countMembersByRoomId(room_id);
        return count;
    }

    // add member
    public Member addMember(String user_id, String room_id){
        if (!rr.existsById(room_id)){
            throw new RuntimeException("Room id not found - no of members");
        }
        // check is user is a member
        if (mr.existsByUserIdAndRoomId(user_id, room_id)) {
            throw new RuntimeException("User is already a member in this room - adding a member");
        }
        Member member = new Member(user_id, room_id);
        return mr.save(member);
    }

    // remove member
    public void removeMember(String user_id, String room_id) throws BadRequestException {
        if (!mr.existsByUserIdAndRoomId(user_id, room_id)) {
            throw new BadRequestException("Membership does not exist - Remove user from room");
        }
        mr.deleteByUserIdAndRoomId(user_id, room_id);
    }

    //helper
    private Member findByUserIdAndRoomId(String userId, String roomId) {
        return mr.findByUserIdAndRoomId(userId, roomId).orElseThrow(() -> new RuntimeException("This user is not a member"));
    }
}
