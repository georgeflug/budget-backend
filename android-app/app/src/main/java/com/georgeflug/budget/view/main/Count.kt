package com.georgeflug.budget.view.main

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.ColorFilter
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.Rect
import android.graphics.Typeface
import android.graphics.drawable.Drawable
import android.graphics.drawable.LayerDrawable
import com.georgeflug.budget.R


class Count : Drawable() {
    private val TEXT_SIZE = 20.0f

    private val circlePaint: Paint = Paint()
    private val textPaint: Paint
    private var count = 0

    init {
        circlePaint.color = Color.parseColor("#ff9e80") // red
        circlePaint.isAntiAlias = true
        circlePaint.style = Paint.Style.FILL

        textPaint = Paint()
        textPaint.color = Color.WHITE
        textPaint.typeface = Typeface.DEFAULT
        textPaint.textSize = TEXT_SIZE
        textPaint.isAntiAlias = true
        textPaint.textAlign = Paint.Align.CENTER
    }

    override fun draw(canvas: Canvas) {
        val count = this.count
        if (count > 0) {
            drawTextInCircle(canvas, count.toString())
        }
    }

    private fun drawTextInCircle(canvas: Canvas, text: String) {
        val bounds = bounds
        val width = bounds.right - bounds.left
        val height = bounds.bottom - bounds.top

        val radius: Float = Math.max(width, height) / 2 / 2f
        val centerX: Float = width - radius - 1f + 20
        val centerY: Float = height / 2f

        canvas.drawCircle(centerX, centerY, radius + 7.5f, circlePaint)

        val rect1 = Rect()
        textPaint.getTextBounds(text, 0, text.length, rect1)
        val textHeight = rect1.bottom - rect1.top
        val textY = centerY + textHeight / 2f

        canvas.drawText(text, centerX, textY, textPaint)
    }

    fun setCount(count: Int) {
        this.count = count
        invalidateSelf()
    }

    override fun setAlpha(alpha: Int) {
        // do nothing
    }

    override fun setColorFilter(cf: ColorFilter?) {
        // do nothing
    }

    override fun getOpacity(): Int {
        return PixelFormat.UNKNOWN
    }

    companion object {
        fun setCounting(icon: LayerDrawable, count: Int) {
            val reuse = icon.findDrawableByLayerId(R.id.ic_badge)
            val badge = if (reuse is Count) reuse else Count()

            badge.setCount(count)
            icon.mutate()
            icon.setDrawableByLayerId(R.id.ic_badge, badge)
        }
    }

}