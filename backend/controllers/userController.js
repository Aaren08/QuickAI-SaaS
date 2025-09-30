import sql from "../configs/db.js";

// FUNCTION TO GET USER CREATIONS
export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();
    const creations =
      await sql`SELECT * FROM creations WHERE user_id = ${userId} ORDER BY created_at DESC`;
    res.json({ success: true, creations });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// FUNCTION TO GET PUBLISH CREATIONS
export const getPublishCreations = async (req, res) => {
  try {
    const creations =
      await sql`SELECT * FROM creations WHERE publish = true ORDER BY created_at DESC`;
    res.json({ success: true, creations });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// FUNCTION TO TOGGLE LIKE & UNLIKE CREATION
export const toggleLikeAndUnlike = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;

    if (!creation) {
      return res
        .status(404)
        .json({ success: false, message: "Creation not found." });
    }

    const currentLikes = creation.likes;
    const userIdStr = userId.toString();
    let updatedLikes;

    if (currentLikes.includes(userIdStr)) {
      // UNLIKE
      updatedLikes = currentLikes.filter((like) => like !== userIdStr);
    } else {
      // LIKE
      updatedLikes = [...currentLikes, userIdStr];
    }

    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`
      UPDATE creations 
      SET likes = ${formattedArray}::text[] 
      WHERE id = ${id}
    `;

    res.json({
      success: true,
      likes: updatedLikes,
      id,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
