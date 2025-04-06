const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const postModel = require("../models/post");

const router = express.Router();

// Post oluşturma
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        status: false,
        message: "Post içeriği boş olamaz",
      });
    }

    const post = await postModel.createPost(userId, content);

    res.json({
      status: true,
      message: "Post başarıyla oluşturuldu",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Tüm postları getirme
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const { posts, count } = await postModel.getAllPosts(limit, offset);

    res.json({
      status: true,
      message: "Postlar başarıyla getirildi",
      data: {
        posts,
        pagination: {
          total: count,
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Kullanıcının kendi postlarını getirme
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const { posts, count } = await postModel.getUserPosts(
      userId,
      limit,
      offset
    );

    res.json({
      status: true,
      message: "Kullanıcı postları başarıyla getirildi",
      data: {
        posts,
        pagination: {
          total: count,
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Belirli bir kullanıcının postlarını getirme
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 20;
    const offset = parseInt(req.query.offset) || 0;

    const { posts, count } = await postModel.getUserPosts(
      userId,
      limit,
      offset
    );

    res.json({
      status: true,
      message: "Kullanıcı postları başarıyla getirildi",
      data: {
        posts,
        pagination: {
          total: count,
          limit,
          offset,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Bir postu id'ye göre getirme
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await postModel.getPostById(postId);

    res.json({
      status: true,
      message: "Post başarıyla getirildi",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Post güncelleme
router.put("/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Önce postu getir ve kullanıcıya ait olduğunu kontrol et
    const post = await postModel.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post bulunamadı",
      });
    }

    if (post.users.id !== userId) {
      return res.status(403).json({
        status: false,
        message: "Bu postu güncelleme yetkiniz yok",
      });
    }

    const updatedPost = await postModel.updatePost(postId, content);

    res.json({
      status: true,
      message: "Post başarıyla güncellendi",
      data: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Post silme
router.delete("/:postId", authenticateToken, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    // Önce postu getir ve kullanıcıya ait olduğunu kontrol et
    const post = await postModel.getPostById(postId);

    if (!post) {
      return res.status(404).json({
        status: false,
        message: "Post bulunamadı",
      });
    }

    if (post.users.id !== userId) {
      return res.status(403).json({
        status: false,
        message: "Bu postu silme yetkiniz yok",
      });
    }

    await postModel.deletePost(postId);

    res.json({
      status: true,
      message: "Post başarıyla silindi",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = router;
